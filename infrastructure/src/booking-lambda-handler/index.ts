// Define the shape of the input event
type OrderEvent = {
  order_id: string;
  amount: number;
  item: string;
};

/**
 * Lambda handler for processing orders and storing receipts in S3.
 */
export const handler = async (event: OrderEvent): Promise<string> => {
  try {

    // Create the receipt content and key destination
    const receiptContent = `OrderID: ${
      event.order_id
    }\nAmount: $${event.amount.toFixed(2)}\nItem: ${event.item}`;
    const key = `receipts/${event.order_id}.txt`;

    return receiptContent;
  } catch (error) {
    console.error(
      `Failed to process order: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    throw error;
  }
};
