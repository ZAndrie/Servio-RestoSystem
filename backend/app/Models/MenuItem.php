<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    use HasFactory;

    public const ARTWORKS = ['bowl', 'plate', 'glass', 'dessert'];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'is_available',
        'is_popular',
        'image',
        'artwork',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_available' => 'boolean',
            'is_popular' => 'boolean',
        ];
    }

    public function getImageAttribute(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        // Uploaded files stored under /storage/menu/... are served by Laravel,
        // so return an absolute URL accessible across ports/LAN tablets.
        if (str_starts_with($value, '/storage/')) {
            return rtrim((string) config('app.url', 'http://localhost:8000'), '/').$value;
        }

        return $value;
    }

    public function getRawImagePath(): ?string
    {
        return $this->attributes['image'] ?? null;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
