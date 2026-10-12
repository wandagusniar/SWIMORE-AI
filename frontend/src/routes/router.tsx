import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/features/home/HomePage'
import { ChatWorkspace } from '@/features/chat/ChatWorkspace'
import { ModelsCatalog } from '@/features/models/ModelsCatalog'
import { ModelDetails } from '@/features/models/ModelDetails'
import { PartnerMarketplace } from '@/features/marketplace/PartnerMarketplace'
import { PricingMatrix } from '@/features/pricing/PricingMatrix'
import { DocumentationView } from '@/features/docs/DocumentationView'
import { ApiKeysDashboard } from '@/features/dashboard/ApiKeysDashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chat',
    element: <ChatWorkspace />,
  },
  {
    path: '/models',
    element: <ModelsCatalog />,
  },
  {
    path: '/models/:id',
    element: <ModelDetails />,
  },
  {
    path: '/marketplace',
    element: <PartnerMarketplace />,
  },
  {
    path: '/pricing',
    element: <PricingMatrix />,
  },
  {
    path: '/docs',
    element: <DocumentationView />,
  },
  {
    path: '/dashboard/keys',
    element: <ApiKeysDashboard />,
  },
  {
    path: '*',
    element: <HomePage />,
  },
])

