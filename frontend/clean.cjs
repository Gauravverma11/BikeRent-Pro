const fs = require('fs');
fs.copyFileSync('src/pages/Home.jsx', 'src/pages/Dashboard.jsx');
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// 1. Rename component
code = code.replace(/const Home = \(\) =>/g, 'const Dashboard = () =>');
code = code.replace(/export default Home;/g, 'export default Dashboard;');

// 2. Remove redirect block
const redirectBlock = `
    // Redirect logged-in users to the real app interface
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);
`;
code = code.replace(redirectBlock, '');

// 3. Replace hero block with a simpler one
const heroRegex = /<div className="relative z-10 text-white max-w-xl pr-8">[\s\S]*?<Bike className="absolute -bottom-10 -right-10 w-64 h-64 text-white\/5 -rotate-12 pointer-events-none" \/>/;
const newHero = `<div className="relative z-10 text-white w-full md:w-1/2 pr-8 mb-8 md:mb-0">
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Book a Ride</h1>
                    <p className="text-blue-100/80 text-sm font-medium">Find premium bikes and EVs in your area instantly.</p>
                </div>`;
code = code.replace(heroRegex, newHero);

// 4. Remove all public marketing sections (Choose Us, How it Works, Reviews, FAQ, Footer)
const startIdx = code.indexOf('{/* WHY CHOOSE US SECTION */}');
const endIdx = code.indexOf('{selectedVehicle && (');
if (startIdx !== -1 && endIdx !== -1) {
    code = code.slice(0, startIdx) + code.slice(endIdx);
} else {
    console.error("Could not find start or end index for section pruning", { startIdx, endIdx });
}

// 5. Remove unused variables: navigate, expandedFaq, handleSearch
code = code.replace(/import { useNavigate } from 'react-router-dom';/, '');
code = code.replace(/const \[expandedFaq, setExpandedFaq\] = useState\(0\);/, '');
code = code.replace(/const navigate = useNavigate\(\);/, '');

// Fix onClick handleSearch
code = code.replace(/onClick=\{handleSearch}/, 'onClick={() => fetchVehicles(city, area, activeTab)}');

// Remove handleSearch definition block
code = code.replace(/const handleSearch = \(\) => \{[\s\S]*?fetchVehicles\(city, area, activeTab\);\s*\};/, '');

// Fix Check Availability button logic (since we're already authenticated)
const oldCheckAvailabilityBtn = `<button
                                            onClick={() => {
                                                if (!user) {
                                                    navigate('/login', { state: { message: "Please log in to book a vehicle" } });
                                                } else {
                                                    setSelectedVehicle(vehicle);
                                                }
                                            }}
                                            disabled={user && vehicle.isCurrentlyAvailable === false}
                                            className={\`w-full py-3.5 font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 \${user && vehicle.isCurrentlyAvailable === false
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                                                }\`}
                                        >
                                            {user && vehicle.isCurrentlyAvailable === false ? "Currently Rented" : "Check Availability"}
                                        </button>`;
const newCheckAvailabilityBtn = `<button
                                            onClick={() => setSelectedVehicle(vehicle)}
                                            disabled={vehicle.isCurrentlyAvailable === false}
                                            className={\`w-full py-3.5 font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 \${vehicle.isCurrentlyAvailable === false
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                                                }\`}
                                        >
                                            {vehicle.isCurrentlyAvailable === false ? "Currently Rented" : "Check Availability"}
                                        </button>`;
code = code.replace(oldCheckAvailabilityBtn, newCheckAvailabilityBtn);

fs.writeFileSync('src/pages/Dashboard.jsx', code);
console.log('Successfully pruned Dashboard.jsx end-to-end');
