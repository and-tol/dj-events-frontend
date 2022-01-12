import cookie from 'cookie';

export const parseCookies = req => {
  return cookie.parse(req ? req.headers.cookie || '' : '');
};

export const serializeData = data => {
  return data.map(d => ({
    ...d.attributes,
    id: d.id,
    image: d.attributes?.image?.data
      ? d.attributes.image.data.attributes.formats
      : null,
  }));
};
