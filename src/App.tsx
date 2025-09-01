// React import not needed in modern React with JSX transform
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ProjectProvider } from './contexts/ProjectContext';
import { UIStateProvider } from './contexts/UIStateContext';

function App() {
  return (
    <Router>
      <ProjectProvider>
        <UIStateProvider>
          <MainLayout />
        </UIStateProvider>
      </ProjectProvider>
    </Router>
  );
}

export default App;
