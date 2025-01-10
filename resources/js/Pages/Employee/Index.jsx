import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';

export default function Index({ employees, query }) {
    // สถานะสำหรับเก็บค่าการค้นหา
    const [search, setSearch] = useState(query || '');

    // สถานะสำหรับเก็บคอลัมน์ที่เลือกเรียง
    const [sortColumn, setSortColumn] = useState(null);

    // สถานะสำหรับเก็บลำดับการเรียง (asc หรือ desc)
    const [sortOrder, setSortOrder] = useState('asc');

    // ฟังก์ชันจัดการเมื่อผู้ใช้กดปุ่มค้นหา
    const handleSearch = (e) => {
        e.preventDefault(); // ป้องกันการ reload หน้า
        // ส่งคำค้นหาไปที่ backend ผ่าน Inertia
        Inertia.get('/employee', { search });
    };

    // ฟังก์ชันจัดการการเรียงข้อมูล
    const handleSort = (column) => {
        if (sortColumn === column) {
            // หากคอลัมน์ที่เลือกซ้ำ จะสลับลำดับการเรียง
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // หากเลือกคอลัมน์ใหม่ ให้ตั้งค่าเรียงจากน้อยไปมาก (asc)
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    // เรียงข้อมูลในตารางตามคอลัมน์และลำดับที่เลือก (ใน component)
    const sortedEmployees = [...employees.data].sort((a, b) => {
        if (!sortColumn) return 0; // หากไม่ได้เลือกคอลัมน์ใด ไม่เรียงข้อมูล

        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // จัดการการเปรียบเทียบสำหรับข้อมูลประเภทข้อความ
        if (typeof aValue === 'string') {
            return sortOrder === 'asc'
                ? aValue.localeCompare(bValue) // เรียงจากน้อยไปมาก
                : bValue.localeCompare(aValue); // เรียงจากมากไปน้อย
        }

        // จัดการการเปรียบเทียบสำหรับข้อมูลประเภทตัวเลข
        if (typeof aValue === 'number') {
            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0; // หากไม่มีเงื่อนไขที่ตรง ให้ข้อมูลไม่เปลี่ยนแปลง
    });

    return (
        <div className="container mx-auto p-4 ">
            {/* ส่วนหัวข้อ */}
            <h1 className="text-2xl font-bold mb-4 text-center ">Employee List</h1>

            {/* ฟอร์มค้นหา */}
            <form onSubmit={handleSearch} className="mb-4 flex justify-end">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} // อัปเดตค่าคำค้นหาในสถานะ
                    className="border border-green-500 px-3 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button type="submit" className="px-4 py-2 rounded-r bg-green-500 hover:bg-green-700 text-white">
                    Search
                </button>
            </form>

            {/* ตารางข้อมูลพนักงาน */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-green-200">
                        {/* หัวตารางที่สามารถกดเพื่อเรียงข้อมูลได้ */}
                        {['emp_no', 'first_name', 'last_name', 'gender', 'birth_date'].map((column) => (
                            <th
                                key={column}
                                className="py-2 px-4 border cursor-pointer"
                                onClick={() => handleSort(column)} // เรียกฟังก์ชัน handleSort เมื่อกดที่หัวตาราง
                            >
                                {column.replace('_', ' ').toUpperCase()} {/* แสดงชื่อคอลัมน์ */}
                                
                                {sortColumn === column && 
                                (<span className="ml-2 text-green-500"> 
                                    {sortOrder === 'asc' ? '▲' : '▼'}
                                </span>
                            )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* แสดงผลข้อมูลที่ถูกเรียง */}
                    {sortedEmployees.map((employee) => (
                        <tr key={employee.emp_no} className="hover:bg-green-100">
                            <td className="py-2 px-4 border">{employee.emp_no}</td>
                            <td className="py-2 px-4 border">{employee.first_name}</td>
                            <td className="py-2 px-4 border">{employee.last_name}</td>
                            <td className="py-2 px-4 border">{employee.gender === 'M' ? 'Male' : 'Female'}</td>
                            <td className="py-2 px-4 border">{employee.birth_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ปุ่มสำหรับการแบ่งหน้า */}
            <div className="pagination mt-4 flex justify-center">
                <button
                    disabled={!employees.prev_page_url} // ปิดการใช้งานปุ่มถ้าไม่มีหน้าเดิม
                    onClick={() => Inertia.visit(employees.prev_page_url)} // ย้ายไปหน้าก่อนหน้า
                    className="px-4 py-2 rounded-l bg-green-500 hover:bg-green-700 text-white disabled:opacity-50"
                >
                    Previous
                </button>
                {/* แสดงเลขหน้า */}
                {Array.from({ length: employees.last_page }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => Inertia.visit(`/employee?page=${page}`)} 
                    className={`px-4 py-2 hover:bg-green-700 hover:text-white ${
                        employees.current_page === page ? 'bg-green-700 text-white' : 'bg-white' 
                    }`}
                >
                {page}
                </button>
                ))}
                <button
                    disabled={!employees.next_page_url} // ปิดการใช้งานปุ่มถ้าไม่มีหน้าถัดไป
                    onClick={() => Inertia.visit(employees.next_page_url)} // ย้ายไปหน้าถัดไป
                    className="px-4 py-2 rounded-r bg-green-500 hover:bg-green-700 text-white disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}