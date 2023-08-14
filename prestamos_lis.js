public class Loan
{
    public int Id { get; set; }
    public string StudentName { get; set; }
    public string StudentDocumentNumber { get; set; }
    public string AdminName { get; set; }
    public string AdminDocumentNumber { get; set; }
    public DateTime LoanDateTime { get; set; }
    public string LoanedItem { get; set; }
    public LoanStatus Status { get; set; }
}

public enum LoanStatus
{
    Returned,
    Pending
}

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LoansController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult CreateLoan(Loan loan)
    {
        _context.Loans.Add(loan);
        _context.SaveChanges();
        return CreatedAtAction(nameof(GetLoanById), new { id = loan.Id }, loan);
    }

    [HttpGet]
    public IActionResult GetAllLoans()
    {
        var loans = _context.Loans.ToList();
        return Ok(loans);
    }

    [HttpGet("{id}")]
    public IActionResult GetLoanById(int id)
    {
        var loan = _context.Loans.FirstOrDefault(l => l.Id == id);
        if (loan == null)
        {
            return NotFound();
        }
        return Ok(loan);
    }

    // Implementa otros métodos similares según los requerimientos.
}

[HttpGet("pending")]
public IActionResult GetPendingLoans()
{
    var pendingLoans = _context.Loans.Where(l => l.Status == LoanStatus.Pending).ToList();
    return Ok(pendingLoans);
}

[HttpPut("{id}/return")]
public IActionResult MarkLoanAsReturned(int id)
{
    var loan = _context.Loans.FirstOrDefault(l => l.Id == id);
    if (loan == null)
    {
        return NotFound();
    }

    loan.Status = LoanStatus.Returned;
    _context.SaveChanges();
    return NoContent();
}

[HttpGet("student/{studentDocumentNumber}")]
public IActionResult GetLoansByStudent(string studentDocumentNumber)
{
    var loans = _context.Loans.Where(l => l.StudentDocumentNumber == studentDocumentNumber).ToList();
    return Ok(loans);
}

[HttpGet("day/{date}")]
public IActionResult GetLoansByDate(DateTime date)
{
    var loansCount = _context.Loans.Count(l => l.LoanDateTime.Date == date.Date);
    return Ok(loansCount);
}

[HttpGet("admin/{adminDocumentNumber}")]
public IActionResult GetLoansByAdmin(string adminDocumentNumber)
{
    var loansCount = _context.Loans.Count(l => l.AdminDocumentNumber == adminDocumentNumber);
    return Ok(loansCount);
}

[HttpPut("{id}")]
public IActionResult UpdateLoan(int id, Loan updatedLoan)
{
    var loan = _context.Loans.FirstOrDefault(l => l.Id == id);
    if (loan == null)
    {
        return NotFound();
    }

    loan.StudentName = updatedLoan.StudentName;
    loan.StudentDocumentNumber = updatedLoan.StudentDocumentNumber;
    loan.AdminName = updatedLoan.AdminName;
    loan.AdminDocumentNumber = updatedLoan.AdminDocumentNumber;
    loan.LoanDateTime = updatedLoan.LoanDateTime;
    loan.LoanedItem = updatedLoan.LoanedItem;
    loan.Status = updatedLoan.Status;

    _context.SaveChanges();
    return NoContent();
}