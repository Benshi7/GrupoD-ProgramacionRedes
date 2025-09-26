"use client"

import type React from "react"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableItem } from "@/components/SortableItem"
import { Badge } from "@/components/ui/badge"

interface Step {
  id: string
  title: string
  description: string
  color: string
  details: string
}

interface DnDSequencerProps {
  steps: Step[]
  currentSequence: string[]
  onSequenceChange: (sequence: string[]) => void
  correctSequence: string[]
}

function DroppableArea({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? "ring-2 ring-primary ring-opacity-50" : ""}`}>
      {children}
    </div>
  )
}

export function DnDSequencer({ steps, currentSequence, onSequenceChange, correctSequence }: DnDSequencerProps) {
  const [availableSteps, setAvailableSteps] = useState(steps.map((step) => step.id))
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    setActiveId(null)

    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (overId === "sequence-dropzone" && availableSteps.includes(activeId)) {
      const newSequence = [...currentSequence, activeId]
      const newAvailable = availableSteps.filter((id) => id !== activeId)

      setAvailableSteps(newAvailable)
      onSequenceChange(newSequence)
      return
    }

    if (currentSequence.includes(activeId) && currentSequence.includes(overId)) {
      const oldIndex = currentSequence.indexOf(activeId)
      const newIndex = currentSequence.indexOf(overId)
      const newSequence = arrayMove(currentSequence, oldIndex, newIndex)
      onSequenceChange(newSequence)
      return
    }

    if (overId === "available-dropzone" && currentSequence.includes(activeId)) {
      const newSequence = currentSequence.filter((id) => id !== activeId)
      const newAvailable = [...availableSteps, activeId]

      setAvailableSteps(newAvailable)
      onSequenceChange(newSequence)
      return
    }
  }

  const getStepById = (id: string) => steps.find((step) => step.id === id)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Pasos disponibles</h3>
          <DroppableArea
            id="available-dropzone"
            className="min-h-[200px] p-4 border-2 border-dashed border-border rounded-lg bg-muted/20"
          >
            <SortableContext items={availableSteps} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {availableSteps.map((stepId) => {
                  const step = getStepById(stepId)
                  if (!step) return null

                  return (
                    <SortableItem key={stepId} id={stepId}>
                      <div className="p-3 bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing hover:glow-accent transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${step.color}`} />
                          <div>
                            <div className="font-medium text-foreground">{step.title}</div>
                            <div className="text-sm text-muted-foreground">{step.description}</div>
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  )
                })}
              </div>
            </SortableContext>
          </DroppableArea>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Secuencia DHCP</h3>
          <DroppableArea
            id="sequence-dropzone"
            className="min-h-[200px] p-4 border-2 border-dashed border-primary/50 rounded-lg bg-primary/5"
          >
            <SortableContext items={currentSequence} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {currentSequence.map((stepId, index) => {
                  const step = getStepById(stepId)
                  if (!step) return null

                  const isCorrect = stepId === correctSequence[index]

                  return (
                    <SortableItem key={`${stepId}-${index}`} id={stepId}>
                      <div
                        className={`p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-all ${
                          isCorrect
                            ? "bg-green-400/10 border-green-400/30 text-green-400"
                            : "bg-red-400/10 border-red-400/30 text-red-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-secondary/50">
                            {index + 1}
                          </Badge>
                          <div className={`w-3 h-3 rounded-full ${step.color}`} />
                          <div>
                            <div className="font-medium">{step.title}</div>
                            <div className="text-sm opacity-80">{step.description}</div>
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  )
                })}
                {currentSequence.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Arrastrá los pasos acá para formar la secuencia DHCP</p>
                    <p className="text-sm mt-1">Orden correcto: DISCOVER → OFFER → REQUEST → ACK</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DroppableArea>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="p-3 bg-card border border-border rounded-lg shadow-lg opacity-90">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStepById(activeId)?.color}`} />
              <div>
                <div className="font-medium text-foreground">{getStepById(activeId)?.title}</div>
                <div className="text-sm text-muted-foreground">{getStepById(activeId)?.description}</div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
