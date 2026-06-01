// FACADE PATTERN: ARCHITECTURAL REFACTOR
// This file acts as a central hub (Facade) re-exporting all domain-specific services.
// This maintains 100% backward compatibility for all React components that currently
// import from 'userService.js', while allowing the codebase to be split internally
// into separate files according to the Single Responsibility Principle (SRP).

export * from './authService';
export * from './doctorService';
export * from './scheduleBookingService';
export * from './specialtyService';
export * from './clinicService';
export * from './handbookService';
export * from './chatboxService';
export * from './adminSystemService';