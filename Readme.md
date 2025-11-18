
# Socket IO Overview

## 1. Introduction
My Socket.io project is a full stack real time chat application where users can sign in, chat one to one, send images, and meet new people in a playground.

The entire project is deployed on Google Cloud Run, and you can try it using this link: https://socket-client-928159139419.asia-south1.run.app/register

## 3. Tech Stack
### **Backend**

-   Uses **Socket.io** for real time one-to-one chat and instant updates.
    
-   **Multer** handles image uploads from users.
    
-   **Cloudinary** stores all uploaded images.
    
-   **MongoDB Atlas** keeps all user details, messages, and conversation data.
    
-   **JWT authentication** for authentication.
    
    

### **Frontend**

-   **Zustand** manages global state related to socket connections.
    
-   **React Context** is used where light shared state is enough.
    
-   **TanStack Query** for api calls.
    
-   **React Hook Form** for forms.
    
-   **Zod** for schema validation for forms and APIs.
    
-   Built with **TypeScript**, **Vite**, **Tailwind CSS**, and **Shadcn UI**
    

### **Infrastructure**

-   Hosted on **Google Cloud Run**
    
-   A **Dockerfile** is used to containerize the backend so Cloud Run can run it in a stable and consistent environment. 
    
## 5. Real-time Messaging Flow
The app supports smooth one-to-one messaging whether the other user is online or offline. When a user sends a message, Socket.io delivers it instantly to the receiver if they are currently connected. 