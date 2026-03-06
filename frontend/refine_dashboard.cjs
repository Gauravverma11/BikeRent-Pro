const fs = require('fs');
const path = 'src/pages/Dashboard.jsx';
let content = fs.readFileSync(path, 'utf8');

console.log('Original content length:', content.length);

// 1. Add sortBy state
content = content.replace(
    /const\s+\{\s*user\s*\}\s*=\s*useAuth\(\);/,
    "const { user } = useAuth();\n    const [sortBy, setSortBy] = useState('name');"
);

// 2. Remove Milestones section
// Use regex to find the whole section from {/* MILESTONES */} up to but not including {/* CUSTOMER FAVOURITES GRID */}
const milestoneRegex = /\{\/\* MILESTONES \*\/\}[\s\S]*?(?=\{\/\* CUSTOMER FAVOURITES GRID \*\/ \})/;
// Note: I added a space after GRID because it might be there. Let's be even more flexible.
const milestoneRegexFlexible = /\{\/\* MILESTONES \*\/\}[\s\S]*?(?=\{\/\* CUSTOMER FAVOURITES GRID \*\/)/;

if (milestoneRegexFlexible.test(content)) {
    console.log('Found Milestones section');
    content = content.replace(milestoneRegexFlexible, '');
} else {
    console.log('Milestones section NOT found via regex');
}

// 3. Replace Customer Favourites heading and add Sort UI
const headerRegex = /\{\/\* CUSTOMER FAVOURITES GRID \*\/\}[\s\S]*?<section className="pt-8">[\s\S]*?<div className="flex items-center justify-between mb-8 px-2">[\s\S]*?<div>[\s\S]*?<h2 className="text-3xl font-black text-gray-900 mb-1">Customer Favourites<\/h2>[\s\S]*?<p className="text-gray-500 font-medium">Bikes that are trending this month 🔥<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newHeader = `{/* AVAILABLE RIDES GRID */}
            <section className="pt-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 px-2 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-1">Available Rides</h2>
                        <p className="text-gray-500 font-medium">Explore our full fleet of premium vehicles</p>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Sort By</span>
                        <div className="relative">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-transparent text-sm font-bold text-gray-700 outline-none pr-8 pl-1 cursor-pointer"
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="popularity">Popularity</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>`;

if (headerRegex.test(content)) {
    console.log('Found Header section');
    content = content.replace(headerRegex, newHeader);
} else {
    console.log('Header section NOT found via regex');
    // Try even simpler regex for header
    const simpleHeaderRegex = /<h2 className="text-3xl font-black text-gray-900 mb-1">Customer Favourites<\/h2>/;
    if (simpleHeaderRegex.test(content)) {
        console.log('Found simple header');
        // If we only find the H2, we might want to replace the whole div
    }
}

// 4. Update the map to include sorting logic
const mapRegex = /\{vehicles\.map\(\s*\(\s*vehicle\s*\)\s*=>\s*\(/;
if (mapRegex.test(content)) {
    console.log('Found Vehicles map');
    content = content.replace(
        mapRegex,
        `{[...vehicles].sort((a, b) => {
                            if (sortBy === 'price_asc') return (a.basePricePerHour * 24) - (b.basePricePerHour * 24);
                            if (sortBy === 'price_desc') return (b.basePricePerHour * 24) - (a.basePricePerHour * 24);
                            if (sortBy === 'name') return a.name.localeCompare(b.name);
                            return 0;
                        }).map((vehicle) => (`
    );
} else {
    console.log('Vehicles map NOT found via regex');
}

fs.writeFileSync(path, content);
console.log('Final content length:', content.length);
