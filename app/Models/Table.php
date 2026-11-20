<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Table extends Model
{
    use HasFactory;

    public const STATUS_AVAILABLE = 'available';

    public const STATUS_OCCUPIED = 'occupied';

    public const STATUSES = [
        self::STATUS_AVAILABLE,
        self::STATUS_OCCUPIED,
    ];

    protected $table = 'tables';

    public $timestamps = false;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'table_number',
        'status',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'table_id');
    }

    public function activeOrder(): HasOne
    {
        return $this->hasOne(Order::class, 'table_id')
            ->where('status', '!=', Order::STATUS_PAID)
            ->latestOfMany();
    }
}
