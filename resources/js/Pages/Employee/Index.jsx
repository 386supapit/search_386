import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';

export default function Index({ employees, query }) {
    const [search, setSearch] = useState(query || '');

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get('/employee', { search });
    };

    return (
        <div className="container mx-auto p-4 "> 
            <h1 className="text-2xl font-bold mb-4 text-center ">Employee List</h1>

            <form onSubmit={handleSearch} className="mb-4 flex justify-center">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-green-500 px-3 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button type="submit" className="px-4 py-2 rounded-r bg-green-500 hover:bg-green-700 text-white">
                    Search
                </button>
            </form>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-green-200">
                        <th className="py-2 px-4 border ">ID</th>
                        <th className="py-2 px-4 border ">Name</th>
                        <th className="py-2 px-4 border ">LastName</th> 
                        <th className="py-2 px-4 border ">Gender</th>
                        <th className="py-2 px-4 border ">Birthday</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.data.map((employee) => (
                        <tr key={employee.emp_no} className="hover:bg-green-100">
                            <td className="py-2 px-4 border">{employee.emp_no}</td>
                            <td className="py-2 px-4 border">{employee.first_name}</td>
                            <td className="py-2 px-4 border">{employee.last_name}</td>
                            <td className="py-2 px-4 border">{employee.gender === 'M'?'Male' : 'Female'}</td>
                            <td className="py-2 px-4 border">{employee.birth_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination mt-4 flex justify-center">
                <button
                    disabled={!employees.prev_page_url}
                    onClick={() => Inertia.visit(employees.prev_page_url)}
                    className="px-4 py-2 rounded-l bg-green-500 hover:bg-green-700 text-white disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 bg-green-200">
                    Page {employees.current_page} of {employees.last_page}
                </span>
                <button
                    disabled={!employees.next_page_url}
                    onClick={() => Inertia.visit(employees.next_page_url)}
                    className="px-4 py-2 rounded-r bg-green-500 hover:bg-green-700 text-white disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}