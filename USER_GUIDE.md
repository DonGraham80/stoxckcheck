# School Catering Stock Management - User Guide

## Welcome to Your Stock Management System

This guide will help you navigate and use the School Catering Stock Management system effectively. The system is designed to streamline your inventory operations, from receiving deliveries to tracking production and managing waste.

## Getting Started

### Accessing the System

1. Open your web browser
2. Navigate to the application URL provided by your administrator
3. The system will load showing the main dashboard

### System Overview

The application consists of several main sections accessible from the left sidebar:

- **Dashboard** - Overview of your inventory status
- **Inventory** - Current stock levels and locations
- **Receipts** - Record supplier deliveries
- **Production** - Plan and record production runs
- **Wastage** - Track and record waste
- **Transfers** - Move stock between locations
- **Counts** - Perform inventory counts
- **Voice** - Voice-controlled operations (coming soon)
- **AI Agent** - Intelligent inventory assistant (coming soon)

## Dashboard

The Dashboard provides a quick overview of your inventory status:

### Key Metrics
- **Total Items**: Number of different products in your system
- **Total Value**: Current value of all inventory
- **Recent Movements**: Number of recent stock transactions
- **Low Stock Items**: Items that need attention

### Visual Charts
- **Stock Movement Types**: Bar chart showing types of recent activities
- **Movement Distribution**: Pie chart showing proportion of different movements
- **Recent Stock Movements**: Table of latest transactions

## Managing Inventory

### Viewing Current Stock (Inventory Tab)

The Inventory view shows all items currently in stock:

1. **Search**: Use the search box to find specific items
2. **Filter by Site**: Select "All Sites" or a specific location
3. **Item Cards**: Each item shows:
   - Item name and SKU
   - Storage type (Chilled/Frozen/Ambient)
   - Category
   - Unit of measure
   - Standard cost
   - Current quantity on hand
   - Total value
   - Locations where stock is held

### Understanding Stock Locations

Each item may be stored in multiple locations:
- **Chiller 1, Chiller 2**: Refrigerated storage
- **Freezer 1, Freezer 2**: Frozen storage  
- **Dry Store**: Ambient temperature storage

## Recording Receipts

When you receive deliveries from suppliers:

### Creating a New Receipt

1. Click **Receipts** in the sidebar
2. Fill in the receipt details:
   - **Site**: Select your location
   - **Supplier**: Choose from the dropdown list
   - **Receipt Lines**: Add items received

### Adding Receipt Lines

For each item received:

1. **Select Item**: Choose from the dropdown
2. **Quantity**: Enter amount received
3. **Unit of Measure**: System automatically shows available units (ml, L, case, etc.)
4. **Unit Cost**: Enter the cost per unit
5. **Lot Code**: Enter supplier's lot/batch number
6. **Expiry Date**: Select expiration date (if applicable)
7. **Location**: Choose where to store the item

### Tips for Receipts
- Always check the unit of measure matches your delivery note
- Record lot codes for traceability
- Enter expiry dates for perishable items
- Choose appropriate storage locations based on item type

## Production Planning

### Recording Production Runs

When you prepare meals or process ingredients:

1. Click **Production** in the sidebar
2. Select your **Site**
3. Choose the **Recipe** from the dropdown
4. Enter **Number of Portions** to produce
5. Click **Create Production Run**

The system will automatically:
- Deduct ingredients from inventory (using FEFO - First Expired, First Out)
- Add finished products to inventory
- Create a complete audit trail

## Managing Wastage

### Recording Waste

When items are damaged, expired, or otherwise unusable:

1. Click **Wastage** in the sidebar
2. Select your **Site**
3. Choose the **Item** being wasted
4. Select the specific **Lot** (batch)
5. Choose the **Location** where waste occurred
6. Enter **Quantity** being wasted
7. Select **Reason** from dropdown:
   - Expired
   - Damaged
   - Contaminated
   - Other
8. Click **Record Wastage**

### Waste Tracking Benefits
- Identify patterns in waste
- Track costs of waste
- Improve ordering decisions
- Meet regulatory requirements

## Inter-Site Transfers

### Moving Stock Between Locations

To transfer items from one site to another:

1. Click **Transfers** in the sidebar
2. Select **From Site** (source location)
3. Select **To Site** (destination)
4. Add transfer lines:
   - Choose **Item**
   - Enter **Quantity** to transfer
5. Click **Create Transfer**

### Transfer Process
- Creates outbound movement at source
- Creates inbound movement at destination
- Maintains complete audit trail
- Updates inventory levels automatically

## Inventory Counts

### Performing Cycle Counts

Regular counting helps maintain inventory accuracy:

1. Click **Counts** in the sidebar
2. Select your **Site**
3. Add count lines for each item:
   - Choose **Item**
   - Select **Lot** (specific batch)
   - Choose **Location**
   - Enter **Expected Quantity** (if known)
   - Enter **Actual Quantity** (what you counted)
4. Click **Perform Count**

### Count Adjustments
- System automatically calculates differences
- Creates adjustment movements for variances
- Updates inventory to actual counted amounts
- Provides audit trail for all adjustments

## Understanding Units of Measure

The system supports multiple units for each item:

### Common Units
- **ml** (milliliters) - for liquids
- **L** (liters) - for larger liquid quantities
- **g** (grams) - for small quantities
- **kg** (kilograms) - for larger weights
- **each** - for individual items
- **pack** - for packaged goods
- **case** - for case quantities

### Unit Conversions
The system automatically handles conversions between:
- Base units (smallest measure)
- Pack units (standard package size)
- Case units (bulk quantities)

## Best Practices

### Daily Operations

1. **Start with Dashboard**: Check overnight movements and alerts
2. **Process Receipts**: Record all deliveries promptly
3. **Monitor Expiry Dates**: Check items approaching expiration
4. **Record Production**: Log all meal preparation activities
5. **Document Waste**: Record any waste immediately

### Weekly Tasks

1. **Review Inventory Levels**: Check for low stock items
2. **Perform Cycle Counts**: Count a selection of items
3. **Analyze Waste Patterns**: Look for improvement opportunities
4. **Plan Production**: Schedule upcoming meal preparation

### Monthly Activities

1. **Full Inventory Review**: Comprehensive stock analysis
2. **Cost Analysis**: Review inventory values and costs
3. **Supplier Performance**: Evaluate delivery accuracy
4. **System Cleanup**: Archive old data if needed

## Troubleshooting

### Common Issues

#### "Item not found" Error
- Check spelling of item name
- Verify item exists in system
- Contact administrator to add new items

#### "Invalid unit of measure" Error
- Use only units shown in dropdown
- Check item's available units
- Contact administrator for unit setup

#### "Insufficient stock" Warning
- Verify current inventory levels
- Check if stock is in correct location
- Consider if recent movements haven't been recorded

### Getting Help

If you encounter issues:

1. **Check this User Guide** for common solutions
2. **Contact your System Administrator** for technical issues
3. **Report Bugs** through your organization's IT support
4. **Request Training** if you need additional help

## Data Security and Backup

### Important Notes

- **Data is automatically saved** as you work
- **All movements are permanently recorded** for audit purposes
- **Regular backups** are performed by your IT team
- **Access logs** track all user activities

### Best Practices

- **Log out** when finished using the system
- **Don't share** your login credentials
- **Report** any suspicious activity
- **Keep** paper records as backup for critical transactions

## System Maintenance

### Scheduled Maintenance

Your IT team may schedule maintenance during:
- Off-peak hours (typically evenings)
- Weekends for major updates
- Holiday periods for system upgrades

You'll receive advance notice of any planned downtime.

### Updates and New Features

The system is regularly updated with:
- Bug fixes and improvements
- New features and capabilities
- Security enhancements
- Performance optimizations

## Contact Information

For support with the Stock Management System:

- **Technical Issues**: Contact your IT Help Desk
- **Training Requests**: Contact your Operations Manager
- **Feature Requests**: Submit through your organization's change management process
- **Emergency Support**: Use your organization's emergency contact procedures

## Appendix

### Keyboard Shortcuts

- **Tab**: Move between form fields
- **Enter**: Submit forms or confirm actions
- **Escape**: Cancel current operation
- **Ctrl+F**: Search within current page

### Mobile Usage

The system is optimized for mobile devices:
- **Touch-friendly** interface
- **Responsive** design adapts to screen size
- **Offline capability** (coming soon)
- **Barcode scanning** (future enhancement)

### Integration with Other Systems

The Stock Management System can integrate with:
- **ERP Systems**: For financial reporting
- **Supplier Catalogs**: For automated item updates
- **Accounting Software**: For cost tracking
- **Reporting Tools**: For advanced analytics

---

*This user guide is regularly updated. Please check for the latest version or contact your administrator for the most current information.*
