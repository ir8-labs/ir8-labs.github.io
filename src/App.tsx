import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HUDLayout from './components/HUDLayout';
import Hero from './pages/Hero';

function App() {
    return (
        <BrowserRouter>
            <HUDLayout>
                <Routes>
                    <Route path="/" element={<Hero />} />
                    {/* Placeholder routes for future states */}
                    <Route path="/protocol" element={<PlaceholderPage title="/PROTOCOL" />} />
                    <Route path="/operations" element={<PlaceholderPage title="/OPERATIONS" />} />
                    <Route path="/initialize" element={<PlaceholderPage title="/INITIALIZE" />} />
                </Routes>
            </HUDLayout>
        </BrowserRouter>
    );
}

// Temporary placeholder for other routes
function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="font-mono text-ir8-gray-mid">
            <span className="text-ir8-white">{title}</span>
            <br />
            <span className="text-xs">[AWAITING IMPLEMENTATION]</span>
        </div>
    );
}

export default App;
