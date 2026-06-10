import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { UserDetailsContext } from "@/context/UserDetailsContext";

type Repo = {
  id: number;
  name: string;
  full_name: string;
  private_: boolean;
  html_url: string;
  description: string;
  language: string;
  updated_at: string;
  default_branch: string;
  owner: {
    login: string;
  };
};

function RepoDialog({
  setRefreshPage,
}: {
  setRefreshPage: (refresh: boolean) => void;
}) {
  const [repoList, setRepoList] = useState<Repo[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const { userDetails } = useContext(UserDetailsContext); // Assuming you have a UserContext to get the current user's ID
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getRepoList();
  }, []);

  const getRepoList = async () => {
    try {
      setLoading(true);

      const result = await axios.get("/api/github/repos");

      console.log("Github Repositories:", result.data);
      setRepoList(result.data);
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = useMemo(() => {
    return repoList.filter((repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [repoList, search]);

  const handleAddRepo = async () => {
    console.log("userDetail", userDetails);
    console.log("userId", userDetails?.id);

    if (!selectedRepo) return;

    const result = await axios.post("/api/user-repo", {
      userId: userDetails?.id,
      repoId: selectedRepo.id,
      name: selectedRepo.name,
      fullName: selectedRepo.full_name,
      private_: selectedRepo.private_,
      description: selectedRepo.description,
      language: selectedRepo.language,
      htmlUrl: selectedRepo.html_url,
      owner: selectedRepo.owner,
    });

    console.log(result.data);
    setIsOpen(false);
    setRefreshPage(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button>Add Repo</Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Repository</DialogTitle>
          <DialogDescription>
            Search and select one of your GitHub repositories.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <Input
            placeholder="Search repositories by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="border rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading repositories...
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No repositories found.
              </div>
            ) : (
              <ul className="max-h-[50vh] overflow-y-auto">
                {filteredRepos.map((repo) => (
                  <li
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo)}
                    className={`p-3 sm:p-4 border-b cursor-pointer transition-colors hover:bg-muted ${
                      selectedRepo?.id === repo.id
                        ? "bg-muted border-l-4 border-l-primary"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h3 className="font-medium break-words">{repo.name}</h3>

                      <span className="text-xs text-muted-foreground shrink-0">
                        {repo.private_ ? "Private" : "Public"}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1 break-words">
                      {repo.description || "No description available"}
                    </p>

                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground">
                      {repo.language && <span>{repo.language}</span>}
                      <span>{repo.default_branch}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedRepo && (
            <div className="rounded-lg border p-3 bg-muted/30">
              <p className="text-sm font-medium">Selected Repository</p>
              <p className="text-sm text-muted-foreground break-all">
                {selectedRepo.full_name}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>

          <Button
            onClick={handleAddRepo}
            disabled={!selectedRepo}
            className="w-full sm:w-auto"
          >
            Add Repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RepoDialog;
