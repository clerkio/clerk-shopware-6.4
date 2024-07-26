<?php

namespace CLERKIO64\clerkio64\Controller\Api;

use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Shopware\Core\Framework\Validation\DataBag\RequestDataBag;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route(defaults={"_routeScope"={"administration"}})
 */
class ApiTestController
{
    /**
     * @Route(path="/api/_action/clerk-api-test/verify")
     */
    public function check(RequestDataBag $dataBag): JsonResponse
    {
        $publickey = $dataBag->get('clerkio64.config.publicKey');
        $url = 'https://api.clerk.io/v2/recommendations/popular?key=' . $publickey;

        //Use file_get_contents to GET the URL in question.
        $contents = json_decode(file_get_contents($url));

        if ($contents->status == 'ok') {
            return new JsonResponse(['success' => true]);
        }
        return new JsonResponse(['success' => false]);
    }
}