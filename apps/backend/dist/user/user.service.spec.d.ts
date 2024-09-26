/// <reference types="jest" />
import { Repository } from 'typeorm';
export type TypeMockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
export declare const mockRepository: <T = any>() => Partial<Record<keyof Repository<T_1>, jest.Mock<any, any>>>;
