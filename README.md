# JavaScript Backend Software with File System Based Routing

This JavaScript backend software provides file system-based routing for your convenience. It allows you to define routes using file paths, making it easy to organize and manage your API endpoints.

## Usage

- Folder file means `localhost:3000/file`.
- To add a new route, simply create a folder. For example, creating a `share` folder will result in `localhost:3000/file/share`.
- Routes are controlled by `[id].ts` files for endpoints in the pattern `localhost:3000/file/123`, and `___index.ts` files for endpoints in the style of `localhost:3000/file`.
- Zero configuration needed.
- You can create routes with waiting sub-routes using `[id]` folders. For instance, creating a `123` folder under `share` will result in a route like `localhost:3000/file/123/share/456`.
- Files starting with `_` (3 underscores) will not be included as endpoint routes and are reserved.
- Every route you create will be automatically included in Swagger documentation.
- API versioning is supported. Simply create a folder like `v1` and collect all your routes under it. For example, `v1/file/` will contain versioned routes.
- Access Swagger documentation for a specific version by accessing `localhost/v1/___docs`.

## Connectors

- The repository includes three simple connectors as templates under the `drivers` folder:
  - Mongoose
  - Firebase
  - Sequelize
- Additional drivers such as Prisma and Drizzle may be included as templates in the future.

## Future Enhancements

- Testing library: A testing library will be added, including at least one simple route test.
- Authentication support for Swagger routes: Currently, Swagger routes do not support authentication if an auth controller is present. Future updates may address this limitation.
- Template engine: Consider implementing a template engine like React for server-side rendering of routes.

## Getting Started

1. Clone this repository.
2. Install dependencies: `npm install`
3. Start the server: `npm start`

## Contributing

Contributions are welcome! If you have any ideas for improvements or new features, feel free to open an issue or submit a pull request.
