using System.Collections.Generic;
using System.Web.Http;
using VendingMachine.Domain;

namespace VendingMachine.Presentation.WebApi.Controllers
{
	public class VendingMachineController : ApiController
	{
		private readonly Domain.VendingMachine _vendingMachine;
		private readonly User _user;

		public VendingMachineController(Domain.VendingMachine vendingMachine, User user)
		{
			_vendingMachine = vendingMachine;
			_user = user;
		}

		[HttpGet]
		public IEnumerable<CoinBatch> Coins()
		{
			return _vendingMachine.GetCoins();
		}

		[HttpGet]
		public IEnumerable<ProductBatch> Products()
		{
			return _vendingMachine.GetProducts();
		}

		[HttpGet]
		public int PaidAmount()
		{
			return _vendingMachine.PaidAmount;
		}

		[HttpGet]
		public IEnumerable<CoinBatch> UserCoins()
		{
			return _user.GetCoins();
		}
		
		[HttpPost]
		public void PutCoin(Coin coin)
		{
			_user.SpendCoin(coin);
			_vendingMachine.PutCoin(coin);
		}

		[HttpPost]
		public IEnumerable<CoinBatch> ReturnChange()
		{
			var change = _vendingMachine.ReturnChange();
			_user.TakeChange(change);
			return change;
		}

		[HttpPost]
		public Product BuyProduct(string title)
		{
			return _vendingMachine.BuyProduct(title);
		}
	}
}