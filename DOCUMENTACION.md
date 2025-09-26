# Grupo D - IFTS 18
## Aplicación Web de Quiz Interactivo sobre Redes

### Información del Proyecto
- **Materia**: Programación sobre Redes
- **Período**: 2do cuatrimestre 2025
- **Profesor**: RUSSATTI, Lucas
- **Integrantes del Grupo D**:
  - CELIA, Bruno (DNI: 41.470.058)
  - DE LUCA, Leila Giselle (DNI: 34.117.783)
  - DE SOUZA GOMES, Anna Clara (DNI: 95.859.027)
  - MARTINI, Fernando Pablo (DNI: 36.724.106)

---

## Descripción del Proyecto

Esta aplicación web interactiva fue desarrollada como respuesta creativa al Trabajo Práctico Teórico de Programación sobre Redes. En lugar de responder las preguntas de manera tradicional, con nuestro Grupo decidimos crear una experiencia de aprendizaje interactiva que combina teoría y práctica a través de quizzes y simuladores.

### Objetivo Académico

El proyecto cumple con el requisito de desarrollar **5 preguntas del trabajo práctico de manera más creativa**, implementando una solución web que permite:

1. **Aprendizaje interactivo** a través de preguntas de opción múltiple
2. **Simuladores prácticos** (sandboxes) para experimentar con conceptos de red
3. **Progreso gamificado** con sistema de niveles y puntuación
4. **Explicaciones detalladas** de cada concepto con ejemplos prácticos

---

## Arquitectura de la Aplicación

### Estructura de Módulos

La aplicación está organizada en **3 módulos principales** que cubren **5 temas** del trabajo práctico:

#### 1. **Módulo DNS & ARP** 
- **Preguntas del TP cubiertas**: #11 (DNS) y #16 (ARP)
- **Contenido**:
  - Funcionamiento del sistema DNS
  - Tipos de servidores DNS (raíz, TLD, autoritativos, caché)
  - Protocolo ARP y traducción IP-MAC
  - Vulnerabilidades de seguridad (ARP spoofing)
- **Sandbox**: Simulador de resolución DNS interactivo

#### 2. **Módulo DHCP & STP**
- **Preguntas del TP cubiertas**: #10 (DHCP) y #14 (STP)
- **Contenido**:
  - Protocolo DHCP y asignación automática de IPs
  - Proceso DORA (Discover, Offer, Request, Ack)
  - Spanning Tree Protocol y prevención de bucles
  - Gestión de enlaces redundantes en switches
- **Sandbox**: Simulador DHCP con drag-and-drop del proceso DORA

#### 3. **Módulo Subnetting & IPv4/IPv6**
- **Preguntas del TP cubiertas**: Conceptos de subredes y #32 (IPv4 vs IPv6)
- **Contenido**:
  - Cálculo de subredes y máscaras CIDR
  - Determinación de hosts por subred
  - Notación CIDR y bits de red/host
  - Diferencias entre IPv4 e IPv6
  - Ventajas y características de IPv6
- **Sandbox**: Calculadora interactiva de subredes

### Tecnologías Utilizadas

- **Frontend**: Next.js 15 con App Router
- **Styling**: Tailwind CSS
- **Interactividad**: @dnd-kit para drag-and-drop
- **Animaciones**: Framer Motion
- **TypeScript**: Para tipado estático y mejor desarrollo

---

## Funcionalidades Principales

### 1. **Sistema de Quiz Progresivo**
- Preguntas de opción múltiple con diferentes niveles de dificultad
- Explicaciones detalladas con ejemplos prácticos
- Sistema de puntuación y progreso por módulo

### 2. **Simuladores Interactivos (Sandboxes)**
- **DNS Sandbox**: Visualización del proceso de resolución de nombres
- **DHCP Sandbox**: Simulador drag-and-drop del proceso DORA
- **Subnetting Sandbox**: Calculadora interactiva de subredes

### 3. **Interfaz Educativa**
- Diseño intuitivo y responsive
- Navegación clara entre módulos
- Feedback inmediato en respuestas
- Enlaces a simuladores desde las explicaciones

### 4. **Sistema de Progreso**
- Tracking de preguntas respondidas por módulo
- Indicadores visuales de progreso
- Persistencia de datos en localStorage

---

## Mapeo con el Trabajo Práctico Original

### Preguntas Implementadas:

| Pregunta TP | Tema | Módulo en App | Implementación |
|-------------|------|---------------|----------------|
| #10 | DHCP | DHCP & STP | 2 preguntas + sandbox interactivo |
| #11 | DNS | DNS & ARP | 2 preguntas + sandbox de resolución |
| #14 | STP | DHCP & STP | 2 preguntas integradas |
| #16 | ARP | DNS & ARP | 2 preguntas integradas |
| #32 | IPv4 vs IPv6 | Subnetting & IPv4/IPv6 | 3 preguntas sobre diferencias y ventajas |
| Subredes | Conceptos de red | Subnetting & IPv4/IPv6 | 3 preguntas + calculadora |

### Valor Agregado Educativo:

1. **Interactividad**: Los conceptos teóricos se complementan con simuladores prácticos
2. **Visualización**: Diagramas y animaciones que facilitan la comprensión
3. **Gamificación**: Sistema de progreso que motiva el aprendizaje
4. **Accesibilidad**: Disponible 24/7 para estudio y repaso
5. **Escalabilidad**: Estructura preparada para agregar más módulos

---

## Aspectos Técnicos Destacados

### 1. **Arquitectura Modular**
- Separación clara entre lógica de negocio y presentación
- Componentes reutilizables y mantenibles
- Tipado mantenible

### 2. **Experiencia de Usuario**
- Diseño responsive para todos los dispositivos
- Animaciones suaves y feedback visual
- Navegación intuitiva y accesible

### 3. **Gestión de Estado**
- Persistencia local de progreso
- Sincronización entre componentes

### 4. **Simuladores Interactivos**
- Drag-and-drop funcional en DHCP
- Visualizaciones dinámicas en DNS
- Cálculos en tiempo real en Subnetting

---

## Conclusión

Esta aplicación web representa una aproximación innovadora al aprendizaje de conceptos de redes, transformando el formato tradicional de preguntas y respuestas en una experiencia interactiva y educativa. Con este proyecto quisimos demostrar entendimiento de los temas, más la aplicación de los mismos a actividades educativas, que vamos a aprovechar para seguir consolidando los conceptos.

La implementación exitosa de los 5 temas requeridos a través de 3 módulos interactivos cumple con los objetivos académicos mientras proporciona una herramienta de estudio valiosa para futuros estudiantes de la materia.

---

**Desarrollado por Grupo D - IFTS 18**
*Programación sobre Redes - 2do Cuatrimestre 2025*
