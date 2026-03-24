<?php

namespace Database\Seeders;

use App\Models\Programme;
use Illuminate\Database\Seeder;

class ProgrammeSeeder extends Seeder
{
    public function run(): void
    {
        $programmes = [
            [
                'code' => 'BTECH',
                'name' => 'B.Tech / Dual Degree (JEE Advanced)',
                'category' => 'B.Tech/Dual Degree (JEE Advanced)',
                'branches' => [
                    'Chemical Engineering',
                    'Civil Engineering',
                    'Computer Science & Engineering',
                    'Electrical Engineering',
                    'Electronics & Communication Engineering',
                    'Engineering Physics',
                    'Environmental Engineering',
                    'Mechanical Engineering',
                    'Mining Engineering',
                    'Metallurgical & Materials Engineering',
                    'Mining Machinery Engineering',
                    'Petroleum Engineering',
                ],
            ],
            [
                'code' => 'IMTECH',
                'name' => 'Integrated M.Tech (JEE Advanced)',
                'category' => 'Integrated M.Tech (JEE Advanced)',
                'branches' => [
                    'Mathematics & Computing',
                    'Applied Geology',
                    'Applied Geophysics',
                ],
            ],
            [
                'code' => 'MTECH',
                'name' => 'M.Tech GATE (2-year)',
                'category' => 'M.Tech GATE (2-year)',
                'branches' => [
                    'Earthquake Science & Engineering',
                    'Data Analytics',
                    'Pharmaceutical Science & Engineering',
                    'Environmental Engineering',
                    'Geotechnical Engineering',
                    'Geology',
                    'Industrial Engineering & Management',
                    'Machine Design',
                    'Manufacturing Engineering',
                    'Power Electronics & Drives',
                    'RF & Microwave Engineering',
                    'Structural Engineering',
                    'Thermal Engineering',
                    'VLSI Design',
                    'Water Resources Engineering',
                ],
            ],
            [
                'code' => 'MSC',
                'name' => 'M.Sc JAM (2-yr)',
                'category' => 'M.Sc JAM (2-yr)',
                'branches' => [
                    'Physics',
                    'Chemistry',
                    'Mathematics & Computing',
                ],
            ],
            [
                'code' => 'MSCTECH',
                'name' => 'M.Sc.Tech JAM (3-yr)',
                'category' => 'M.Sc.Tech JAM (3-yr)',
                'branches' => [
                    'Applied Geology',
                    'Applied Geophysics',
                ],
            ],
            [
                'code' => 'MBA',
                'name' => 'MBA (CAT)',
                'category' => 'MBA (CAT)',
                'branches' => [
                    'Business Analytics',
                    'Finance',
                    'Marketing',
                    'Human Resources',
                    'Operations',
                ],
            ],
            [
                'code' => 'PHD',
                'name' => 'Ph.D (GATE/NET)',
                'category' => 'Ph.D (GATE/NET)',
                'branches' => null,
            ],
            [
                'code' => 'MA',
                'name' => 'M.A. Digital Humanities & Social Sciences',
                'category' => 'M.A. Digital Humanities & Social Sciences',
                'branches' => null,
            ],
        ];

        foreach ($programmes as $programme) {
            Programme::create($programme);
        }
    }
}
