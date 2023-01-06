<?php

/*
sw64.stubbe.dev/addtocart?ids=SW10001&qtys=5
sw64.stubbe.dev/addtocart?ids=SW10001,SW10002&qtys=5,2
*/
namespace CLERKIO64\clerkio64\Controller\Api;

use Shopware\Storefront\Controller\StorefrontController;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Validation\DataBag\RequestDataBag;
use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Shopware\Core\Framework\Context;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelRepositoryInterface;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Core\Content\Product\Cart\ProductLineItemFactory;
use Shopware\Core\Checkout\Cart\SalesChannel\CartService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;



/**
 * @RouteScope(scopes={"storefront"})
 */
class AddToCartController extends StorefrontController
{

  /**
   * @SalesChannelRepository
   */
  private $SalesChannelRepository;
  /**
   * @ProductRepository
   */
  private $ProductRepository;
  /**
   * @ProductLineItemFactory
   */
  private $ProductLineItemFactory;
  /**
   * @CartService
   */
  private $CartService;
  /**
   * @SystemConfigService
   */
  private $SystemConfigService;


  public function __construct(
    SalesChannelRepositoryInterface $SalesChannelRepository,
    ProductLineItemFactory $ProductLineItemFactory,
    CartService $CartService,
    SystemConfigService $SystemConfigService
  ) {
    $this->ProductRepository = $SalesChannelRepository;
    $this->ProductLineItemFactory = $ProductLineItemFactory;
    $this->CartService = $CartService;
    $this->SystemConfigService = $SystemConfigService;
  }


  /**
   *  
   * @Route(path="/api/addtocart", name="frontend.addtocart", methods={"GET"})
   * 
   */
  public function addtocart(Request $Request, RequestDataBag $DataBag, Context $Context, SalesChannelContext $SalesChannelContext): Response
  {


    if ( $this->SystemConfigService->get('clerkio64.config.clerkAtcActive') == 'n' ) {
      return $this->RedirectToRoute('frontend.home.page');
    }

    $prod_ids = explode(',', $Request->query->get('ids') );
    $prod_qtys = explode(',', $Request->query->get('qtys') );

    /* to cart */
    $this->addaccessoryitems( $prod_ids, $prod_qtys, $SalesChannelContext );

    return $this->RedirectToRoute('frontend.checkout.cart.page');

  }

  private function addaccessoryitems(array $prod_ids, array $prod_qtys, SalesChannelContext $SalesChannelContext): void
  {

    foreach ($prod_ids as $key => $productNumber) {

      $filter = new Criteria();
      $filter->setLimit(1);
      $filter->addFilter( new EqualsFilter('productNumber', $productNumber) );
      $productId = $this->ProductRepository->searchIds($filter, $SalesChannelContext)->getIds();

      $productId = array_shift($productId);

      if ( $productId ) {

        $quantity = !empty($prod_qtys[$key]) ? (int)$prod_qtys[$key] : 1;

        $item = $this->ProductLineItemFactory->create( $productId, ['quantity' => $quantity] );

        $addtocart = $this->CartService->getCart( $SalesChannelContext->getToken(), $SalesChannelContext );
        $addtocart = $this->CartService->add( $addtocart, $item, $SalesChannelContext );

      } 

    }

  }

}
