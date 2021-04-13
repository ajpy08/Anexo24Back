import express, { Application } from 'express'
import userRoutes from '../routes/usuario';
import cors from 'cors'

class Server {
    private app: Application;
    private port: string;
    private apiPaths = {
        usuarios: '/api/usuarios'
    }

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8000';

        // Metodos iniciales
        this.middlewares();
        this.routes();
    }

    // BD

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura del body
        this.app.use(express.json());

        // Carpeta pública
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.apiPaths.usuarios, userRoutes)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}`);
        });
    }
}

export default Server;