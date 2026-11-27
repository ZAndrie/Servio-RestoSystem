<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    public $timestamps = false;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'order_id',
        'menu_item_id',
        'unit_price',
        'quantity',
        'notes',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'name',
        'image',
        'artwork',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'quantity' => 'integer',
        ];
    }

    public function getNameAttribute(): string
    {
        if ($this->relationLoaded('menuItem')) {
            return $this->menuItem?->name ?? 'Dish';
        }

        return (string) ($this->menuItem()->value('name') ?? 'Dish');
    }

    public function getImageAttribute(): ?string
    {
        if ($this->relationLoaded('menuItem')) {
            return $this->menuItem?->image;
        }

        return null;
    }

    public function getArtworkAttribute(): ?string
    {
        if ($this->relationLoaded('menuItem')) {
            return $this->menuItem?->artwork;
        }

        return null;
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'menu_item_id');
    }
}
