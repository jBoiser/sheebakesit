<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $order->reference_no }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; margin: 0; padding: 20px; font-size: 14px; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        
        /* Logo Styles */
        .logo-img { width: 100px; height: auto; margin-bottom: 10px; }
        .logo-text { font-size: 24px; font-weight: bold; color: #e91e63; font-family: cursive; margin-bottom: 5px; }
        .sub-logo { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #666; }
        
        .section-title { font-weight: bold; font-size: 12px; color: #999; border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 5px; margin-top: 20px; }
        
        .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .label { font-weight: bold; width: 80px; }
        .value { flex: 1; text-align: right; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { text-align: left; padding: 10px 0; border-bottom: 2px solid #e91e63; color: #e91e63; font-size: 12px; text-transform: uppercase; }
        td { padding: 10px 0; border-bottom: 1px solid #eee; vertical-align: middle; }
        .text-right { text-align: right; }
        
        .item-img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
        
        .total-row td { border-top: 2px solid #333; font-weight: bold; font-size: 16px; padding-top: 15px; }
        
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <!-- Logo at the top -->
            <img src="{{ public_path('storage/footers/logo1.png') }}" class="logo-img" alt="Logo">
            
            <div class="logo-text">Shee Bakes It</div>
            <div class="sub-logo">Order Confirmation</div>
        </div>

        <div class="section-title">CLIENT DETAILS</div>
        <!-- Use Tables for layout compatibility in dompdf if flexbox fails, but simple div rows often work in newer versions -->
        <table style="width: 100%; margin: 0;">
            <tr>
                <td><strong>Name:</strong> {{ $order->customer_name }}</td>
                <td class="text-right"><strong>Ref #:</strong> {{ $order->reference_no }}</td>
            </tr>
            <tr>
                <td><strong>Phone:</strong> {{ $order->contact }}</td>
                <td class="text-right"><strong>Date:</strong> {{ $order->created_at->format('m/d/Y') }}</td>
            </tr>
            <tr>
                <td><strong>Email:</strong> {{ $order->email }}</td>
                <td class="text-right"><strong>Pay:</strong> {{ $order->payment_mode }}</td>
            </tr>
            <tr>
                <td colspan="2"><strong>Address:</strong> {{ $order->address }}</td>
            </tr>
        </table>

        <table>
            <thead>
                <tr>
                    <th style="width: 60px;">Image</th>
                    <th>Item Description</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                <tr>
                    <td>
                        @if($item->image_path)
                            <img src="{{ $item->image_path }}" class="item-img" alt="Item">
                        @else
                            <div style="width:50px; height:50px; background: #eee;"></div>
                        @endif
                    </td>
                    <td>{{ $item->item_name }}</td>
                    <td class="text-right">${{ number_format($item->price, 2) }}</td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">${{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
                
                <tr class="total-row">
                    <td colspan="4" class="text-right">GRAND TOTAL</td>
                    <td class="text-right">${{ number_format($order->total_amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            <p>Thank you for supporting my small business!</p>
            <p>Simply | Delicious | Home | Bakes</p>
        </div>
    </div>

</body>
</html>