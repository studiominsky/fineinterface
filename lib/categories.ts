import {
    Archive,
    BrainCircuit,
    Briefcase,
    Building2,
    Code,
    Cpu,
    Globe,
    Landmark,
    Megaphone,
    PenTool,
    ShoppingCart,
    Target,
} from 'lucide-react';

export const categoryGroups = [
    {
        title: 'Services',
        items: [
            { name: 'Portfolio', slug: 'portfolio', icon: Briefcase },
            { name: 'Software', slug: 'software', icon: Archive },
            { name: 'Agency', slug: 'agency', icon: Building2 },
            { name: 'Artificial Intelligence', slug: 'ai', icon: BrainCircuit },
            { name: 'Tech', slug: 'tech', icon: Cpu },
            { name: 'Web3', slug: 'web3', icon: Globe },
        ],
    },
    {
        title: 'Tools',
        items: [
            { name: 'Development Tools', slug: 'dev-tools', icon: Code },
            { name: 'Design Tools', slug: 'design-tools', icon: PenTool },
            { name: 'Marketing', slug: 'marketing', icon: Megaphone },
        ],
    },
    {
        title: 'Money',
        items: [
            { name: 'Finance', slug: 'finance', icon: Landmark },
            { name: 'E-commerce', slug: 'ecommerce', icon: ShoppingCart },
            { name: 'Productivity', slug: 'productivity', icon: Target },
        ],
    },
];