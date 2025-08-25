import { SidebarContent } from './SidebarContent';

export const CategorySidebar = () => {
  return (
    <aside className="hidden lg:sticky lg:top-20 lg:flex h-[calc(100vh-5rem)] w-64 flex-col border-r p-4">
      <SidebarContent />
    </aside>
  );
};
