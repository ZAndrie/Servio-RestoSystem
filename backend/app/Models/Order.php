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

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_PREPARING,
        self::STATUS_READY,
        self::STATUS_SERVED,
        self::STATUS_PAID,
        self::STATUS_CANCELLED,
    ];

    public const ACTIVE_STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_PREPARING,
        self::STATUS_READY,
        self::STATUS_SERVED,
    ];

    public const PAYMENT_UNPAID = 'unpaid';

    public const PAYMENT_PAID = 'paid';

    public const PAYMENT_STATUSES = [
        self::PAYMENT_UNPAID,
        self::PAYMENT_PAID,
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
     * Strict forward-only kitchen/dining status transition map (for paid orders).
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
        'order_ref',
        'table_id',
        'user_id',
        'status',
        'payment_status',
        'service_charge',
        'total',
        'payment_method',
        'amount_paid',
        'cancellation_reason',
        'cancelled_by',
        'paid_at',
        'created_at',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'table_number',
        'server_name',
        'change_amount',
        'change',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'service_charge' => 'decimal:2',
            'total' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function getOrderRefAttribute(?string $value): string
    {
        return $value ?: ('ORD-'.(1000 + (int) $this->id));
    }

    public function getTableNumberAttribute(): ?string
    {
        if ($this->relationLoaded('table')) {
            /** @var Table|null $diningTable */
            $diningTable = $this->getRelation('table');

            return $diningTable?->table_number;
        }

        return $this->table()->value('table_number');
    }

    public function getServerNameAttribute(): ?string
    {
        if ($this->relationLoaded('user')) {
            /** @var User|null $server */
            $server = $this->getRelation('user');

            return $server?->name;
        }

        return $this->user()->value('name');
    }

    public function getChangeAmountAttribute(): ?string
    {
        if ($this->amount_paid === null) {
            return null;
        }

        $paidCents = (int) round(((float) $this->amount_paid) * 100);
        $totalCents = (int) round(((float) $this->total) * 100);

        return number_format(max(0, $paidCents - $totalCents) / 100, 2, '.', '');
    }

    public function getChangeAttribute(): ?string
    {
        return $this->change_amount;
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

    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
