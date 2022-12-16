export enum StatusCode {
  /** The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing). */
  BAD_REQUEST = 400,
  /** Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response. */
  UNAUTHORIZED = 401,
  /** This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists. */
  PAYMENT_REQUIRED = 402,
  /** The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server. */
  FORBIDDEN = 403,
  /** The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web. */
  NOT_FOUND = 404,
  /** The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling DELETE to remove a resource. */
  METHOD_NOT_ALLOWED = 405,
  /** This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent. */
  NOT_ACCEPTABLE = 406,
  /** This is similar to 401 Unauthorized but authentication is needed to be done by a proxy. */
  PROXY_AUTHENTICATION_REQUIRED = 407,
  /** This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message. */
  REQUEST_TIMEOUT = 408,
  /** This response is sent when a request conflicts with the current state of the server. */
  CONFLICT = 409,
  /** This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code. */
  GONE = 410,
  /** Server rejected the request because the Content-Length header field is not defined and the server requires it. */
  LENGTH_REQUIRED = 411,
  /** The client has indicated preconditions in its headers which the server does not meet. */
  PRECONDITION_FAILED = 412,
  /** Request entity is larger than limits defined by server. The server might close the connection or return an Retry-After header field. */
  PAYLOAD_TOO_LARGE = 413,
  /** The URI requested by the client is longer than the server is willing to interpret. */
  URI_TOO_LONG = 414,
  /** The media format of the requested data is not supported by the server, so the server is rejecting the request. */
  UNSUPORTED_MEDIA_TYPE = 415,
  /** The range specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target URI's data. */
  RANGE_NOT_SATISFIABLE = 416,
  /** This response code means the expectation indicated by the Expect request header field cannot be met by the server. */
  EXPECTATION_FAILED = 417,
  /** The server refuses the attempt to brew coffee with a teapot. */
  I_AM_A_TEAPOT = 418,
  /** The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI. */
  MISDIRECTED_REQUEST = 419,
  /** The request was well-formed but was unable to be followed due to semantic errors. */
  UNPROCESSABLE_ENTITY = 422,
  /** The resource that is being accessed is locked. */
  LOCKED = 423,
  /** The request failed due to failure of a previous request. */
  FAILED_DEPENDENCY = 424,
  /** Indicates that the server is unwilling to risk processing a request that might be replayed. */
  TOO_EARLY = 425,
  /** The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s). */
  UPGRADE_REQUIRED = 426,
  /** The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict. */
  PRECONDITION_REQUIRED = 428,
  /** The user has sent too many requests in a given amount of time ("rate limiting"). */
  TOO_MANY_REQUEST = 429,
  /** The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.*/
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  /** The user agent requested a resource that cannot legally be provided, such as a web page censored by a government. */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  /** The server has encountered a situation it does not know how to handle. */
  INTERNAL_SERVER_ERROR = 500,
  /** The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD. */
  NOT_IMPLEMENTED = 501,
  /** This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response. */
  BAD_GATEWAY = 502,
  /** The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached. */
  SERVICE_UNAVAILABLE = 503,
  /** This error response is given when the server is acting as a gateway and cannot get a response in time. */
  GATEWAY_TIMEOUT = 504,
  /** The HTTP version used in the request is not supported by the server. */
  HTTP_VERSION_NOT_SUPPORTED = 505,
  /** The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process. */
  VARIANT_ALSO_NEGOCIATES = 506,
  /** The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request. */
  INSUFFICIENT_STORAGE = 507,
  /** The server detected an infinite loop while processing the request. */
  LOOP_DETECTED = 508,
  /** Further extensions to the request are required for the server to fulfill it. */
  NOT_EXTENTED = 510,
  /** Indicates that the client needs to authenticate to gain network access. */
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}

const errorStatus = [
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418,
  419, 422, 423, 424, 425, 426, 428, 428, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508,
  510, 511,
] as const;

export type ErrorStatus = typeof errorStatus[number];
