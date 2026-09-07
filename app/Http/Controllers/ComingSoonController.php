<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ComingSoonController extends Controller
{
    public function show(string $title = 'Coming Soon', string $description = ''): Response
    {
        return Inertia::render('ComingSoon', [
            'title' => $title,
            'description' => $description !== ''
                ? $description
                : 'This page will be available soon.',
        ]);
    }

    public function inventoryDecommission(): Response
    {
        return $this->show(
            'Decommission Request',
            'Request to decommission assigned inventory items.',
        );
    }
}
