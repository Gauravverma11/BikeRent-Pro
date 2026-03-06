const fs = require('fs');

// Revert dashboard to home
fs.copyFileSync('src/pages/Home.jsx', 'src/pages/Dashboard.jsx');

// Run the initial cleaner
let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// 1. Rename component
code = code.replace(/const Home = \(\) =>/g, 'const Dashboard = () =>');
code = code.replace(/export default Home;/g, 'export default Dashboard;');

// 2. Remove redirect block
const redirectBlock = `    // Redirect logged-in users to the real app interface\n    useEffect(() => {\n        if (user) {\n            navigate('/dashboard', { replace: true });\n        }\n    }, [user, navigate]);`;
if (code.includes(redirectBlock)) {
    code = code.replace(redirectBlock, '');
} else {
    // fuzzy match if exact match fails
    code = code.replace(/\/\/ Redirect logged-in users[\s\S]*?navigate\]\);/, '');
}

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
    console.error("Could not find start or end index for section pruning");
}

/* 5. Clean unused references and remaining 'navigate' usages safely */
// Remove `expandedFaq`
code = code.replace(/const \[expandedFaq, setExpandedFaq\] = useState\(0\);/, '');

// Remove `navigate` definition
code = code.replace(/const navigate = useNavigate\(\);/, '');

// Remove `useNavigate` import
code = code.replace(/import \{ useNavigate \} from 'react-router-dom';/, '');

// Simplify `Check Availability` button which has `navigate` reference
code = code.replace(/onClick=\{\(\) => \{[\s\S]*?if \(!user\) \{[\s\S]*?navigate\('\/login'[\s\S]*?\} else \{[\s\S]*?setSelectedVehicle\(vehicle\);[\s\S]*?\}[\s\S]*?\}\}/, 'onClick={() => setSelectedVehicle(vehicle)}');
code = code.replace(/disabled=\{user && vehicle\.isCurrentlyAvailable === false\}/g, 'disabled={vehicle.isCurrentlyAvailable === false}');
code = code.replace(/\{user && vehicle\.isCurrentlyAvailable === false \? "Currently Rented" : "Check Availability"\}/g, '{vehicle.isCurrentlyAvailable === false ? "Currently Rented" : "Check Availability"}');

// Replace handleSearch which has navigate reference
code = code.replace(/onClick=\{handleSearch\}/, 'onClick={() => fetchVehicles(city, area, activeTab)}');
// Strip the old handleSearch block completely
code = code.replace(/const handleSearch = \(\) => \{[\s\S]*?fetchVehicles\(city, area, activeTab\);\s*\};/, '');


fs.writeFileSync('src/pages/Dashboard.jsx', code);
console.log('Successfully and safely pruned Dashboard.jsx end-to-end');
