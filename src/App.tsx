import { LayoutProvider, useLayout } from "@/hooks/useLayout";
import { LAYOUT_COMPONENTS } from "@/layouts";

function CurrentLayout() {
  const { layout } = useLayout();
  const Layout = LAYOUT_COMPONENTS[layout];
  return <Layout />;
}

export default function App() {
  return (
    <LayoutProvider>
      <CurrentLayout />
    </LayoutProvider>
  );
}
