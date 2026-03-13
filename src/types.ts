export interface ArchitecturePattern {
  id: string;
  name: string;
  description: string;
  category: 'Backend' | 'Frontend' | 'System' | 'Security';
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  icon: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ARCHITECTURE_PATTERNS: ArchitecturePattern[] = [
  {
    id: 'microservices',
    name: 'Microservices',
    description: 'An architectural style that structures an application as a collection of services that are highly maintainable and testable.',
    category: 'Backend',
    complexity: 'Advanced',
    tags: ['Scalability', 'Independence', 'DevOps'],
    icon: 'Layers'
  },
  {
    id: 'event-driven',
    name: 'Event-Driven Architecture',
    description: 'A software architecture pattern promoting the production, detection, consumption of, and reaction to events.',
    category: 'System',
    complexity: 'Intermediate',
    tags: ['Async', 'Pub/Sub', 'Decoupling'],
    icon: 'Zap'
  },
  {
    id: 'clean-architecture',
    name: 'Clean Architecture',
    description: 'A software design philosophy that separates the elements of a design into ring levels.',
    category: 'System',
    complexity: 'Intermediate',
    tags: ['SOLID', 'Testability', 'Maintainability'],
    icon: 'Shield'
  },
  {
    id: 'serverless',
    name: 'Serverless',
    description: 'A cloud-native development model that allows developers to build and run applications without having to manage servers.',
    category: 'Backend',
    complexity: 'Beginner',
    tags: ['Cloud', 'FaaS', 'Cost-Effective'],
    icon: 'Cloud'
  }
];

export const TOOLS: Tool[] = [
  { id: 'generator', name: 'Boilerplate Generator', description: 'Generate starting code for your chosen architecture.', icon: 'Code' },
  { id: 'tester', name: 'Architecture Tester', description: 'Simulate load and failure scenarios.', icon: 'Activity' },
  { id: 'diagram', name: 'Visualizer', description: 'Turn architecture descriptions into visual diagrams.', icon: 'Layout' }
];
