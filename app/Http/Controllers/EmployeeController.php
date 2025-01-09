<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\support\Facades\DB;
use Illuminate\support\Facades\Log;
use Inertia\Inertia;


class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       $query = $request->input('search');
       $employees = DB::table('employees')
       ->where(function ($q) use ($query) { // ใช้ closure เพื่อจัดกลุ่มเงื่อนไข
        $q->where('first_name', 'like', '%' . $query . '%')
          ->orWhere('last_name', 'like', '%' . $query . '%')
          ->orWhere('birth_date', 'like', '%' . $query . '%');
    })
       ->paginate(10);
       
       //$data = json_decode(json_encode($employees),true); //ใช้ json ในการสร้าง array
       Log::info($employees);

       //return response($data);
       //กำหนด Controller ให้ส่งผลลัพธ์ไปแสดงผลที่ VUE
       return Inertia::render('Employee/Index',[
        'employees'=>$employees,
        'query' => $query,
       ]);
       //return response($employees);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
