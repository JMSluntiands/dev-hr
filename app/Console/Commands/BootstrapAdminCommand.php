<?php

namespace App\Console\Commands;

use Database\Seeders\DefaultAdminSeeder;
use Illuminate\Console\Command;

class BootstrapAdminCommand extends Command
{
    protected $signature = 'hr:bootstrap-admin';

    protected $description = 'Create default admin@luntiands.com and sync permissions (fresh install)';

    public function handle(): int
    {
        $this->call('db:seed', ['--class' => DefaultAdminSeeder::class, '--force' => true]);

        $this->info('Default admin ready.');
        $this->line('Email:    admin@luntiands.com');
        $this->line('Password: LuntianAdmin@2026');
        $this->warn('Change this password after first login.');

        return self::SUCCESS;
    }
}
