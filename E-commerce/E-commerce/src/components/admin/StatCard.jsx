const StatCard = ({ label, value, icon: Icon, color = 'text-accent', trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fadeInUp opacity-0" style={{ animationFillMode: 'forwards' }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-heading font-bold text-primary">{value}</p>
        {trend && <p className="text-xs text-success mt-1">↑ {trend} this month</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export default StatCard;
