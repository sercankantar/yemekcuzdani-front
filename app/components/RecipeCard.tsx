interface RecipeCardProps {
    name: string;
    description: string;
    image: string;
  }
  
  const RecipeCard: React.FC<RecipeCardProps> = ({ name, description, image }) => {
    return (
      <div className="border rounded-lg shadow-md overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover" 
          onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')} // Görsel yüklenemezse placeholder kullanılır
        />
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">{name}</h2>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    );
  };
  
  export default RecipeCard;
  