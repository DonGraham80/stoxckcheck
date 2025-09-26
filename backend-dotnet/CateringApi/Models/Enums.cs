using System.ComponentModel.DataAnnotations;

namespace CateringApi.Models
{
    public enum StorageType
    {
        Ambient,
        Chilled,
        Frozen
    }

    public enum MovementType
    {
        Receipt,
        Production,
        TransferOut,
        TransferIn,
        Adjustment,
        Wastage
    }

    public enum TransferStatus
    {
        Pending,
        Picked,
        Received,
        Cancelled
    }
}
