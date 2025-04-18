# GergeLupo Website

## Prerequisites

- Windows 10/11
- WSL (Ubuntu) installed
  - Run `wsl --install` in VS Code or PowerShell/Command Prompt if not already installed
  - Follow Microsoft's guide (https://docs.microsoft.com/en-us/windows/wsl/install) for detailed instructions
- VS Code installed
  - Download from (https://code.visualstudio.com/) 
  - Install the "Remote - WSL" extension in VS Code
- Node.js and npm installed in WSL
  - Run in Ubuntu/WSL terminal:
    
    ` sudo apt update && sudo apt install nodejs npm `
    
  - Recommended Node.js version: v16 or higher

## Setup Instructions

1. Clone the Repository
   
   ` git clone https://github.com/georgeness/Aesthetical-Engineers-Spring2025.git `
   

2. Navigate to the Project Directory
   
   ` cd Aesthetical-Engineers-Spring2025 `
   
4. Open the Project in VS Code
   
   ` code . `

5. Install Dependencies
   In the VS Code terminal (Terminal > New Terminal), run:
   
   ` npm install `
   
   This will install all required dependencies including:
   - Next.js (React framework)
   - MongoDB tools
   - Authentication libraries
   - 3D rendering libraries (Three.js)
   - UI components and styling tools

6. Environment Setup
   The project uses environment variables for database connections and other services. 
   Check if default `.env` file is included

7. Start the Development Server

   ` npm run dev `
   
   
   The application will be available at http://localhost:3000

## Additional Information

- Database: The project uses MongoDB Atlas. The connection string is provided in the `.env` file.
- Authentication: User authentication is handled through Next-Auth.
- File Storage: The project uses Vercel Blob Storage for media files.

## Troubleshooting

If you encounter any issues during setup:

1. Make sure all prerequisites are correctly installed
2. Verify that you're using the correct Node.js version
3. Check that all environment variables are properly set
4. Ensure MongoDB and Vercel connections are working properly

` vercel --prod ` - is a command used to deploy your application to Vercel's production environment.
