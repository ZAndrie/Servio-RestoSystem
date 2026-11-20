<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_PREPARING = 'preparing';

    public const STATUS_READY = 'ready';

    public const STATUS_SERVED = 'served';

    public const STATUS_PAID = 'paid';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_PREPARING,
        self::STATUS_READY,
        self::STATUS_SERVED,
        self::STATUS_PAID,
    ];

    public const PAYMENT_CASH = 'cash';

    public const PAYMENT_GCASH = 'gcash';

    public const PAYMENT_CARD = 'card';

    public const PAYMENT_METHODS = [
        self::PAYMENT_CASH,
        self::PAYMENT_GCASH,
        self::PAYMENT_CARD,
    ];

    /**
     * Strict forward-only status transition map.
     *
     * @var array<string, string>
     */
    public const NEXT_STATUS = [
        self::STATUS_PENDING => self::STATUS_PREPARING,
        self::STATUS_PREPARING => self::STATUS_READY,
        self::STATUS_READY => self::STATUS_SERVED,
        self::STATUS_SERVED => self::STATUS_PAID,
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'table_id',
        'user_id',
        'status',
        'total',
        'payment_method',
        'amount_paid',
        'paid_at',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'change',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function getChangeAttribute(): ?string
    {
        if ($this->amount_paid === null) {
            return null;
        }

        $paidCents = (int) round(((float) $this->amount_paid) * 100);
        $totalCents = (int) round(((float) $this->total) * 100);

        return number_format(($paidCents - $totalCents) / 100, 2, '.', '');
    }

    public function canTransitionTo(string $targetStatus): bool
    {
        return (self::NEXT_STATUS[$this->status] ?? null) === $targetStatus;
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class, 'table_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
