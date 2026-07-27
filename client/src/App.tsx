import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MuseumProvider } from "./contexts/MuseumContext";
import Home from "./pages/Home";
import { CuratorProvider, useCurator } from "./curator/CuratorContext";
import CuratorActivator from "./curator/CuratorActivator";
import CuratorMode from "./curator/CuratorMode";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* Hidden curator route — renders the same Home; CuratorActivator detects the path */}
      <Route path={"/curator"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

/* Renders the curator overlay above everything when active.
 * Invisible and inert for regular visitors. */
function CuratorLayer() {
  const { isCurator } = useCurator();
  return (
    <>
      <CuratorActivator />
      {isCurator && <CuratorMode />}
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <MuseumProvider>
          <CuratorProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <CuratorLayer />
            </TooltipProvider>
          </CuratorProvider>
        </MuseumProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
