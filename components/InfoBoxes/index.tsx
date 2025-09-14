import InfoBox from "./infoBox";

const InfoBoxes = () => {
  return (
    <section className="py-10">
      <div className="container-xl lg:container m-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoBox
            heading="Buy"
            buttonInfo={{ text: "Browse", link: "/properties" }}
          >
            Find your ideal rental property among our diverse range of listings tailored to your needs.
          </InfoBox>
          <InfoBox
            heading="Sell"
            buttonInfo={{ text: "List your property", link: "/properties/add" }}
          >
            Showcase your property with high-quality images and detailed descriptions to attract interested buyers.
          </InfoBox>
          <InfoBox
            heading="Rent"
            buttonInfo={{ text: "Explore", link: "/properties" }}
          >
            Explore rental options ranging from budget-friendly apartments to luxurious penthouses.
          </InfoBox>
        </div>
      </div>
    </section>
  );
}

export default InfoBoxes;