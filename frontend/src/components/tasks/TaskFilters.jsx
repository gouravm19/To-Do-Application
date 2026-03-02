import { Search, X, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const priorityOptions = [
  { value: '', label: 'All Priority' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const dueDateOptions = [
  { value: '', label: 'All Dates' },
  { value: 'today', label: 'Due Today' },
  { value: 'week', label: 'This Week' },
  { value: 'overdue', label: 'Overdue' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export const TaskFilters = ({
  filters,
  onFilterChange,
  categories = [],
  isGridView,
  onViewChange,
}) => {
  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== '' && v !== 'createdAt' && v !== 'desc'
  ).length;

  const handleClearFilters = () => {
    onFilterChange({
      status: '',
      priority: '',
      category_id: '',
      due_date: '',
      search: '',
      sort: 'createdAt',
      order: 'desc',
    });
  };

  return (
    <div className="space-y-4">
      {/* Top row: Search and View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
            data-testid="task-search-input"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-white"
              onClick={() => onFilterChange({ ...filters, search: '' })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 rounded-lg p-1">
            <Button
              variant={!isGridView ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange(false)}
              className={cn(
                'h-8 px-3',
                !isGridView ? 'bg-slate-700 text-white' : 'text-slate-400'
              )}
              data-testid="list-view-btn"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={isGridView ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange(true)}
              className={cn(
                'h-8 px-3',
                isGridView ? 'bg-slate-700 text-white' : 'text-slate-400'
              )}
              data-testid="grid-view-btn"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Filter Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="sm:hidden border-slate-700 text-slate-300"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-blue-500">{activeFilterCount}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-slate-800 border-slate-700 text-white"
            >
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {statusOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.status === option.value}
                  onCheckedChange={() => 
                    onFilterChange({ ...filters, status: option.value })
                  }
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              {priorityOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={filters.priority === option.value}
                  onCheckedChange={() => 
                    onFilterChange({ ...filters, priority: option.value })
                  }
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter pills (desktop) */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <Select
          value={filters.status || ''}
          onValueChange={(value) => onFilterChange({ ...filters, status: value })}
        >
          <SelectTrigger 
            className="w-36 h-9 bg-slate-800 border-slate-700 text-white"
            data-testid="status-filter"
          >
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value || 'all'}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority || ''}
          onValueChange={(value) => onFilterChange({ ...filters, priority: value })}
        >
          <SelectTrigger 
            className="w-36 h-9 bg-slate-800 border-slate-700 text-white"
            data-testid="priority-filter"
          >
            <SelectValue placeholder="All Priority" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value || 'all'}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select
          value={filters.category_id || ''}
          onValueChange={(value) => onFilterChange({ ...filters, category_id: value })}
        >
          <SelectTrigger 
            className="w-40 h-9 bg-slate-800 border-slate-700 text-white"
            data-testid="category-filter"
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Due Date Filter */}
        <Select
          value={filters.due_date || ''}
          onValueChange={(value) => onFilterChange({ ...filters, due_date: value })}
        >
          <SelectTrigger 
            className="w-36 h-9 bg-slate-800 border-slate-700 text-white"
            data-testid="duedate-filter"
          >
            <SelectValue placeholder="All Dates" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {dueDateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value || 'all'}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sort || 'createdAt'}
          onValueChange={(value) => onFilterChange({ ...filters, sort: value })}
        >
          <SelectTrigger className="w-36 h-9 bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-slate-400 hover:text-white"
            data-testid="clear-filters-btn"
          >
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
