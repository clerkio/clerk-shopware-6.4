<?php

namespace CLERKIO64\clerkio64\Controller\Api;

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

        $response = file_get_contents($url);
        if ($response === false) {
            return new JsonResponse(['success' => false]);
        }

        $contents = json_decode($response);
        if (is_object($contents) && isset($contents->status) && $contents->status === 'ok') {
            return new JsonResponse(['success' => true]);
        }
        return new JsonResponse(['success' => false]);
    }
}