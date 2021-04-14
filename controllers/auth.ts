import {Request, Response} from 'express';

export const signup = (req: Request, res: Response) => {
    res.send('signup');
};

export const signin = (req: Request, res: Response) => {
    res.send('signin');
};

export const profile = (req: Request, res: Response) => {
    res.send('profile');
};