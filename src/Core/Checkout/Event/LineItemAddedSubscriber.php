<?php declare(strict_types=1);

namespace CLERKIO64\clerkio64\Core\Checkout\Event;

use Shopware\Core\Framework\Struct\ArrayStruct;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class LineItemAddedSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            'Shopware\\Core\\Checkout\\Cart\\Event\\LineItemAddedEvent' => 'onLineItemAdded',
        ];
    }

    public function onLineItemAdded(object $event): void
    {
        if (!method_exists($event, 'getContext')) {
            return;
        }

        $event->getContext()->addExtension('product_count', new ArrayStruct());
    }
}
