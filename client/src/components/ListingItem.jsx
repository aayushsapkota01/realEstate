import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import PropTypes from "prop-types";

export default function ListingItem({
  listing = {
    _id: "",
    imageUrls: [],
    name: "",
    address: "",
    description: "",
    offer: false,
    discountPrice: 0,
    regularPrice: 0,
    type: "",
    bedrooms: 0,
    bathrooms: 0,
  },
}) {
  const {
    _id,
    imageUrls,
    name,
    address,
    description,
    offer,
    discountPrice,
    regularPrice,
    type,
    bedrooms,
    bathrooms,
  } = listing;

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${_id}`}>
        <img
          src={
            imageUrls[0] ||
            "https://img.freepik.com/free-photo/charming-yellow-house-with-wooden-windows-green-grassy-garden_181624-8074.jpg?t=st=1724920735~exp=1724924335~hmac=8aca4863e87a3010cff8bd4ac0242dde789900735db04568e7c0a0a365dd7348&w=1480"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">{address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          <p className="text-slate-500 mt-2 font-semibold ">
            $
            {offer
              ? discountPrice.toLocaleString("en-US")
              : regularPrice.toLocaleString("en-US")}
            {type === "rent" && " / month"}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">
              {bedrooms > 1 ? `${bedrooms} beds ` : `${bedrooms} bed `}
            </div>
            <div className="font-bold text-xs">
              {bathrooms > 1 ? `${bathrooms} baths ` : `${bathrooms} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string,
    offer: PropTypes.bool,
    discountPrice: PropTypes.number,
    regularPrice: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
  }),
};
