## Aromalife Backend - Personalización de Velas

Bienvenido al backend de **Aromalife**, una aplicación web diseñada para ofrecer una experiencia única e inmersiva en la personalización de velas. Este repositorio contiene la API y la lógica del servidor.

## Tecnologías Utilizadas

- [NestJS](https://nestjs.com) - Framework para construir aplicaciones escalables del lado del servidor.
- [TypeORM](https://typeorm.io) - ORM para manejar la persistencia de datos.
- [Docker](https://www.docker.com) - Contenedores para facilitar el despliegue.

## Requisitos Previos

- [Node.js](https://nodejs.org) (versión 16 o superior)
- [Yarn](https://yarnpkg.com)
- [Docker](https://www.docker.com)

## Configuración del Proyecto

### Instalación

1. Instalar dependencias:

   ```bash
   yarn install
   ```

2. Configurar variables de entorno en un archivo `.env` basado en `.env.example`.

3. Ejecutar el servidor:

   ```bash
   # Desarrollo
   yarn start:dev

   # Producción
   yarn start:prod
   ```

### Docker

1. Construir y ejecutar el contenedor:

   ```bash
   docker-compose up --build
   ```

2. Acceder al API:
   - [http://localhost:3001](http://localhost:3001)

## Funcionalidades Clave del Backend

- Gestión de usuarios y autenticación
- Procesamiento de tests sensoriales y emocionales
- Recomendaciones de aromas basadas en reglas
- Gestión de pedidos y suscripciones
- Integración con sistemas de pago
- Generación de códigos QR
- Base de datos (postgres)

## Pruebas

Ejecutar pruebas unitarias y de integración:

```bash
yarn test
```

## Despliegue

### Despliegue con Mau

1. Instalar Mau:

   ```bash
   yarn install -g mau
   ```

2. Desplegar la aplicación:

   ```bash
   mau deploy
   ```

### Despliegue Manual

1. Construir la imagen Docker:

   ```bash
   docker-compose build
   ```

2. Subir la imagen a un registro de contenedores.

3. Configurar y desplegar en tu infraestructura preferida (AWS, GCP, etc.).

## Documentación

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Docker Documentation](https://docs.docker.com)

---

¡Gracias por elegir Aromalife! 