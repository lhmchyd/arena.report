# arena.report

A comprehensive tracking application for Arena Breakout Infinite, built with Next.js, TypeScript, and Tailwind CSS.

![Arena Breakout Tracker Dashboard](public/dashboard-preview.png)

## Overview

arena.report is a client-side application designed to help players of Arena Breakout Infinite track their key usage, armor durability, and overall performance. The application stores all data locally in the browser, ensuring privacy and security while providing powerful analytics and management tools.

## Features

### Key Management
- Track multiple keys with detailed information:
  - Key name and location
  - Purchase cost
  - Usage count and history
  - Profit tracking per run
- Record key runs with profit amounts
- View detailed analytics including:
  - Total profit per key
  - Return on investment (ROI)
  - Average profit per run
  - Complete run history with dates

### Armor Durability Management
- Track body armor and armored rigs with comprehensive details:
  - Armor class and protected areas
  - Material type and weight
  - Movement speed and ergonomics penalties
  - Durability thresholds (new, like new, worn)
- Repair calculator:
  - Simulate repairs with different NPCs
  - View durability deductions for each repair option
  - Make informed decisions about when to repair
- Export and import armor collections:
  - Share your armor collection with other players
  - Import collections shared by others

### Performance Analytics
- Dashboard with key performance indicators:
  - Total investment and profit
  - Net profit calculations
  - Run counts and trends
- Profit performance charts:
  - Cumulative profit over time (7/14/30 day views)
  - Location-based profit distribution
- Daily performance calendar:
  - Visualize daily profits
  - See which keys were used each day
  - Hover for detailed daily breakdowns

### Profile Management
- Create multiple profiles for different accounts or characters
- Switch between profiles seamlessly
- Each profile maintains separate key and armor collections

### Privacy & Security
- All data stored locally in your browser
- No data transmitted to external servers
- Option to export/import data for backup or sharing
- Clear data functionality for complete privacy control

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Context API
- **Storage**: Browser localStorage
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/arena.report.git
   ```

2. Navigate to the project directory:
   ```bash
   cd arena.report
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

### Available Scripts

- `pnpm dev` - Starts the development server
- `pnpm build` - Builds the application for production
- `pnpm start` - Starts the production server
- `pnpm lint` - Runs the linter to check for code issues

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
pnpm build
```

### Deployment

The application can be deployed to any platform that supports Next.js applications, such as:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Firebase Hosting

## Project Structure

```
arena.report/
├── app/                 # Next.js 13+ app directory
│   ├── support/         # Support page route
│   ├── layout.tsx       # Root layout component
│   ├── page.tsx         # Main page (entry point)
│   └── globals.css      # Global CSS styles
├── components/          # React components
│   ├── armor-manager/   # Armor tracking components
│   ├── dashboard/       # Dashboard and analytics components
│   ├── dialogs/         # Shared dialog components
│   ├── key-tracker/     # Key tracking components
│   ├── profiles/        # Profile management components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── main-tracker.tsx # Main application component
│   ├── main-sidebar.tsx # Main sidebar navigation
│   ├── sidebar-header.tsx # Sidebar header component
│   ├── mobile-restriction.tsx # Mobile restriction component
│   ├── settings-page.tsx # Settings page component
│   └── support-page.tsx # Support page component
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx   # Mobile detection hook
│   └── use-toast.ts     # Toast notification hook
├── lib/                 # Utility functions and libraries
│   └── utils.ts         # Utility functions
├── public/              # Static assets
└── styles/              # Global styles
    └── globals.css      # Global CSS styles
```

## Key Components

### Main Tracker (`components/main-tracker.tsx`)
The main application component that orchestrates all functionality, including:
- Profile management
- Navigation between key tracker and armor manager
- Theme switching (light/dark mode)
- Data persistence

### Key Tracker (`components/key-tracker/`)
Comprehensive key management system with:
- Key listing and filtering
- Run recording and tracking
- Detailed analytics and statistics
- Screenshot functionality for run history

### Armor Manager (`components/armor-manager/`)
Complete armor durability management with:
- Armor listing and filtering
- Detailed armor information display
- Repair calculator with NPC simulation
- Export/import functionality

### Dashboard (`components/dashboard/`)
Analytics dashboard featuring:
- Performance metrics and KPIs
- Profit trend visualization
- Location-based performance analysis
- Daily performance calendar

## Data Management

All data is stored locally in the browser's localStorage:
- Keys and run history
- Armor collections and repair history
- Profile information
- Application preferences

### Data Export/Import
Armor collections can be exported as JSON for backup or sharing:
1. Navigate to Armor Manager
2. Click the export button in the top right
3. Copy the JSON data or download as a file
4. To import, click the import button and paste the JSON data

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [v0.dev](https://v0.dev) and [Qwen3](https://tongyi.aliyun.com/qianwen/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

## Disclaimer

This application is an unofficial fan project created for educational and personal use. It is not affiliated with MoreFun Studio or the Arena Breakout Infinite development team. All game-related information is publicly available and used for informational purposes only.