# RESTapi default documentation

This is the default template for backend developing for some of `@shoxie` and `@Th1ngNg0` projects.

- Generated with `express-generator`

## Endpoints that require Authentication

- [GetAllUser] : `GET /api/`
- [GetUser] : `GET /api/:username`

## Endpoints that don't require Authentication

- [Login] : `GET /api/login`
- [CreateUser]: `GET /api/register`

### Current Settings

Create a `.env` file then fill these lines

- [port]: `localhost port`
- [MONGO_URL] : `url to mongodb`
