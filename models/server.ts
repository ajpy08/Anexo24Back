import express, { Application } from 'express'
import authRoutes from '../routes/auth';
import userRoutes from '../routes/user';
import empresaRoutes from '../routes/empresa';
import direccionRoutes from '../routes/direccion';
import entidadesRoutes from '../routes/entidades';
import cors from 'cors'
import db from '../db/connection';

class Server {
    private app: Application;
    private port: string;
    private apiPaths = {
        auth: '/api/auth',
        usuarios: '/api/users',
        empresas: '/api/empresas',
        direcciones: '/api/direcciones',
        entidades: '/api/entidades'
    }

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '8000';

        // Metodos iniciales
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('Database Online');
        } catch (error) {
            throw new Error(error);
        }
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura del body
        this.app.use(express.json());

        // Carpeta pública
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.apiPaths.auth, authRoutes);
        this.app.use(this.apiPaths.usuarios, userRoutes);
        this.app.use(this.apiPaths.empresas, empresaRoutes);
        this.app.use(this.apiPaths.direcciones, direccionRoutes);
        this.app.use(this.apiPaths.entidades, entidadesRoutes);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port: ${this.port}`);
        });
    }
}

export default Server;