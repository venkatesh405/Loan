Loan Process

Users
- Bank Manager - 1
- Customer relationship managers - 4
- End User - many

End users applies for loan,

In a customer support unit that operates for Loan application processing,, there are 4 customer relationship managers.
The users who are approaching the Loan Disbursal firm are mapped to these managers based on round robin technique in such a way that the first 4 consecutive customers are mapped to the 4 managers in the firm in a sequence. The fifth customer is mapped to the first manager who has got the first client mapped to his bucket.
Implement the logic in which this process of mapping is automated.

Users APIs

-Signup
- Login
- Applying Loan
- Loan Status

Customer relationship managers API
- Login
- Loan Status update
- Loan requests list

Bank Manager
- Login
- Second Level Accept / Reject
- all Loan requests list
